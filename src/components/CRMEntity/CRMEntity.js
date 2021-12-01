import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import logo from "../../assets/img/company.png";
import customersApi from "../../js/api/customer";
import facilitiesApi from "../../js/api/facilities";
import locationApi from "../../js/api/locations";
import equipmentApi from "../../js/api/equipment";
import InformationComponent from "../InformationComponent/InformationComponent";
import DropdownImageEdit from "../widgets/DropdownImageEdit/DropdownImageEdit";
import InfoCard from "../InfoCard/InfoCard";
import { alert } from "../../js/helpers/alert";
import "../../scss/CRMEntity.scss";
import ModalComponent from "../ModalComponent/ModalComponent";
import { GlobalContext } from "../../context";
import AttachedFiles from "../AttachedFiles/AttachedFiles";
import convertToBase64 from "../../js/helpers/convertImage";
import DropzoneComponent from "../Dropzone/Dropzone";

const CRMEntity = ({ type }) => {
  type = type.entity;
  const { id } = useParams();
  const { showFormModal, setShowFormModal, setEntityID } =
    useContext(GlobalContext);

  let deleteEntityImageAPI;
  let getEntityAPI;
  let addEntityImageAPI;
  let setMainEntityImageAPI;
  let subEntityName = "";
  const [screenSize, SetScreenSize] = useState(window.innerWidth);
  const [entityObject, setEntityObject] = useState();
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedSchemas, setAttachedSchemas] = useState([]);
  const [attachedDocs, setAttachedDocs] = useState([]);
  const [mainImage, setMainImage] = useState();
  const [subEntity, setSubEntity] = useState();
  const [informationItems, setInformationItems] = useState([]);
  const informationFieldNames = ["address", "phone", "email"];
  const [mode, setMode] = useState("edit");
  const [fileTypes, setFileTypes] = useState([
    { type_id: "1", setFunc: setAttachedImages },
    { type_id: "2", setFunc: setAttachedDocs },
    { type_id: "3", setFunc: setAttachedSchemas },
  ]);
  const getMainImage = (images) => {
    let mainImage = images.find((x) => x.main_image === "1");
    if (!mainImage) {
      mainImage = images[0];
    }
    return mainImage;
  };
  const deleteEntityImage = (file) => {
    deleteEntityImageAPI(id, file.id).then((res) => {
      alert("success", `image deleted`);
      setAttachedImages(res[`${type}Images`]);
    });
  };
  async function addEntityImage(files, type_id) {
    // const fileBaseFormat = await convertToBase64(file);
    const newFiles = [...files];

    const fileType = fileTypes.find((fileType) => fileType.type_id === type_id);
    // switch (fileType) {
    //   case "image":
    //     fileTypeId = "1";
    //     setAttachedFiles = setAttachedImages;
    //     break;
    //   case "schema":
    //     fileTypeId = "3";
    //     setAttachedFiles = setAttachedSchemas;
    //     break;
    //   case "doc":
    //     fileTypeId = "2";
    //     setAttachedFiles = setAttachedDocs;
    //     break;
    //   default:
    //     break;
    // }
    if (fileType) {
      for (let i = 0; i < newFiles.length; i++) {
        let base64Format = await convertToBase64(newFiles[i]);
        let data = await { type_id: fileType.type_id, img: base64Format };

        const response = await addEntityImageAPI(id, data);

        fileType.setFunc([...response[`${type}Images`]]);
      }
    } else {
      alert("warning", "wrong type of file");
    }
  }
  const setMainEntityImage = (imageId) => {
    setMainEntityImageAPI(id, imageId).then((res) => {
      setMainImage(res["main-image"]);
    });
  };
  const setNewInformationItem = (fieldTitle, value) => {
    setInformationItems((oldArr) => {
      const newElement = { fieldTitle: fieldTitle, value: value };

      return [...oldArr, newElement];
    });
  };
  switch (type) {
    case "customer":
      getEntityAPI = customersApi.getCustomer;
      deleteEntityImageAPI = customersApi.deleteCustomerImage;
      addEntityImageAPI = customersApi.addCustomerImage;
      setMainEntityImageAPI = customersApi.setMainCustomerImage;
      subEntityName = "facilities";
      break;
    case "facility":
      getEntityAPI = facilitiesApi.getFacility;
      deleteEntityImageAPI = facilitiesApi.deleteFacilityImage;
      addEntityImageAPI = facilitiesApi.addFacilityImage;
      setMainEntityImageAPI = facilitiesApi.setMainFacilityImage;
      subEntityName = "locations";
      break;
    case "location":
      subEntityName = "equipment";
      getEntityAPI = locationApi.getLocation;

      break;
    case "equipment":
      getEntityAPI = equipmentApi.getEquipment;
      deleteEntityImageAPI = equipmentApi.deleteImageEquipment;
      addEntityImageAPI = equipmentApi.createImageEquipment;
      setMainEntityImageAPI = equipmentApi.setMainEquipmentImage;
      break;
    default:
      break;
  }

  useEffect(() => {
    getEntityAPI(id).then((data) => {
      if (type === "customer" || type === "facility") {
        data = data[type][id];
      } else {
        data = data[type];
      }
      setEntityObject(data);
      if (data[`${type}Images`]) {
        fileTypes.forEach((fileType) => {
          const files = data[`${type}Images`].filter(
            (file) => file.type_id === fileType.type_id
          );
          fileType.setFunc([...files]);
        });
        // setAttachedImages([...data[`${type}Images`]]);

        const mainImage = getMainImage(data[`${type}Images`]);
        setMainImage(mainImage);
      }
      if (data.jsonData) {
        const customFields = data.jsonData;

        customFields.forEach((el) => {
          if (el.value) {
            setNewInformationItem(el.name, el.value);
          }
        });
      }
      if (subEntityName.length !== 0) {
        setSubEntity(data[subEntityName]);
      }

      informationFieldNames.forEach((field) => {
        if (data[field]) {
          setNewInformationItem(field, data[field]);
        }
      });
    });

    setEntityID(id);

    window.addEventListener("resize", handleResize);
  }, []);
  const handleResize = () => {
    SetScreenSize(window.innerWidth);
  };
  const toggleModal = () => {
    setShowFormModal(!showFormModal);
  };
  return (
    <>
      <ModalComponent
        modal={showFormModal}
        toggle={toggleModal}
        type={{ entity: subEntityName }}
        mode={mode}
      />
      <div className="d-flex align-items-center entity-page--header">
        {entityObject && entityObject[`${type}Images`] && (
          <div className="main-img--container">
            <img
              src={
                mainImage && mainImage.img
                  ? process.env.REACT_APP_SERVER_URL + "/" + mainImage.img
                  : logo
              }
              alt="company img"
              className="entity-page--img"
            ></img>
            <DropdownImageEdit
              images={
                attachedImages && attachedImages.length > 0
                  ? attachedImages
                  : []
              }
              setMainImage={setMainEntityImage}
            ></DropdownImageEdit>
          </div>
        )}
        <h1 className="page-title">{entityObject && entityObject.name}</h1>
      </div>

      {entityObject && informationItems.length > 0 && (
        <div className="entity-page--section">
          <InformationComponent
            items={informationItems}
            title={`Information ${type}`}
          ></InformationComponent>
        </div>
      )}

      {entityObject && subEntityName.length > 0 && (
        <div className="info-page--section">
          <h2 className="page-subtitle">{`${type} ${subEntityName}`}</h2>
          <div
            className={
              screenSize > 440 ? "info-card_group" : "info-card_group dense"
            }
          >
            {subEntity && subEntity.length > 0 ? (
              subEntity.map((subEnt) => (
                <InfoCard
                  data={subEnt}
                  type={subEntityName}
                  toggleModal={toggleModal}
                  setMode={setMode}
                />
              ))
            ) : (
              <p>No {subEntityName} found.</p>
            )}
          </div>
        </div>
      )}

      {entityObject && entityObject[`${type}Images`] && (
        // <DropzoneComponent
        //   type="image"
        //   title="Attached images"
        //   onAddFile={addEntityImage}
        //   onRemoveFile={deleteEntityImage}
        //   attachedFiles={attachedImages ? attachedImages : []}
        // />
        <div className="entity-page--section">
          <div className="attached-files--list">
            <div className="attached-files--item">
              <AttachedFiles
                type="image"
                title="Attached images"
                onAddFile={addEntityImage}
                onRemoveFile={deleteEntityImage}
                attachedFiles={attachedImages ? attachedImages : []}
              />
            </div>
            <div className="attached-files--item">
              <AttachedFiles
                type="schema"
                title="Attached Schemas"
                onAddFile={addEntityImage}
                onRemoveFile={deleteEntityImage}
                attachedFiles={attachedSchemas ? attachedSchemas : []}
              />
            </div>
            <div className="attached-files--item">
              <AttachedFiles
                type="doc"
                title="Attached docs"
                onAddFile={addEntityImage}
                onRemoveFile={deleteEntityImage}
                attachedFiles={attachedDocs ? attachedDocs : []}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CRMEntity;
