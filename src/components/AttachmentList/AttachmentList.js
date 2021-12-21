import React, { useEffect, useState } from "react";
import AttachedFiles from "../AttachedFiles/AttachedFiles";
import convertToBase64 from "../../js/helpers/convertImage";
import { alert } from "../../js/helpers/alert";
import PropTypes from "prop-types";
const AttachmentList = ({
  titleNeeded = true,
  multiple = true,
  maxFiles = 0,
  types = [{ typeID: "1" }, { typeID: "2" }, { typeID: "3" }],
  attachedFiles,
  onAddFileServer = null,
  onRemoveFileServer = null,
  setCreatedFiles,
  fileType,
}) => {
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedSchemas, setAttachedSchemas] = useState([]);
  const [attachedDocs, setAttachedDocs] = useState([]);

  async function onAddImage(files, type) {
    let setFilesFunction;
    let newFiles;

    if (type === "1") {
      setFilesFunction = setAttachedImages;
    } else if (type === "2") {
      setFilesFunction = setAttachedSchemas;
    } else if (type === "3") {
      setFilesFunction = setAttachedDocs;
    }
    Promise.all(
      files.map(async (img) => {
        return {
          preview: img.preview,
          img: img.path,
          id: `${Math.random() * 1000}`,
          filename: img.name,
          base64: await convertToBase64(img),
        };
      })
    ).then(async (res) => {
      newFiles = res;
      const data = res.map((file) => {
        let filename = "";
        if (file.filename && file.filename.split(".", 1)[0].length > 0) {
          filename = file.filename.split(".", 1)[0];
        }
        return {
          type_id: type,
          img: file.base64,
          isDeleted: 0,
          id: file.id,
          fileName: filename,
        };
      });
      if (onAddFileServer) {
        let responseData = await onAddFileServer(data, type);
        if (responseData && responseData.length) {
          alert(
            "success",
            `${
              type === "1" ? "Image" : type === "2" ? "Schema" : "Document"
            } added.`
          );
          newFiles = responseData.map((file) => {
            return {
              img: file.img,
              preview: process.env.REACT_APP_SERVER_URL + "/" + file.img,
              type_id: file.type_id,
              id: file.id,
            };
          });
        }
      }
      if (setCreatedFiles) {
        alert(
          "success",
          `${
            type === "1" ? "Image" : type === "2" ? "Schema" : "Document"
          } added.`
        );
        setCreatedFiles((state) => [...state, ...data]);
      }

      setFilesFunction((state) => [...state, ...newFiles]);
    });
  }
  async function onRemoveImage(file, type) {
    let setFilesFunction;
    let isDeleted = true;
    if (type === "1") {
      setFilesFunction = setAttachedImages;
    } else if (type === "2") {
      setFilesFunction = setAttachedSchemas;
    } else if (type === "3") {
      setFilesFunction = setAttachedDocs;
    }
    if (onRemoveFileServer) {
      isDeleted = await onRemoveFileServer(file.id, type);
    } else {
      let fileToDelete;
      if (attachedFiles) {
        fileToDelete = attachedFiles.find((el) => el.id === file.id);
      }
      if (fileToDelete) {
        setCreatedFiles((state) => [
          ...state,
          {
            isDeleted: 1,
            imageID: fileToDelete.id,
            type_id: fileToDelete.type_id,
          },
        ]);
      } else {
        setCreatedFiles((state) => state.filter((el) => el.id !== file.id));
      }
    }
    if (isDeleted) {
      alert(
        "success",
        `${
          type === "1" ? "Image" : type === "2" ? "Schema" : "Document"
        } removed.`
      );
      setFilesFunction((state) => {
        const updatedFiles = state.filter((el) => el.id !== file.id);
        return updatedFiles;
      });
    }
  }

  useEffect(() => {
    if (attachedFiles && attachedFiles.length > 0) {
      let updatedFiles = attachedFiles;
      if (fileType && fileType === "location") {
        updatedFiles = attachedFiles.filter((img) => img["type_id"] === "1");
      } else if (fileType && fileType === "equipment") {
        updatedFiles = attachedFiles
          .filter((img) => img["type_id"] === "2")
          .map((img) => {
            return { ...img, type_id: "1" };
          });
      }

      updatedFiles = updatedFiles.map((file) => {
        const preview = process.env.REACT_APP_SERVER_URL + "/" + file.img;

        return {
          img: file.img,
          preview,
          type_id: file.type_id,
          id: file.id,
        };
      });
      types.forEach((type) => {
        if (type.typeID === "1") {
          setAttachedImages(updatedFiles.filter((el) => el.type_id === "1"));
        } else if (type.typeID === "2") {
          setAttachedSchemas(updatedFiles.filter((el) => el.type_id === "2"));
        } else if (type.typeID === "3") {
          setAttachedDocs(updatedFiles.filter((el) => el.type_id === "3"));
        }
      });
    }
  }, [attachedFiles]);
  return (
    <>
      <div className="row">
        {types && types.find((el) => el.typeID === "1") && (
          <div className="col">
            <AttachedFiles
              type="1"
              name={titleNeeded ? "Images" : ""}
              accepted=".jpg, .jpeg, .png"
              onAddFile={onAddImage}
              onRemoveFile={onRemoveImage}
              attachedFiles={attachedImages}
              multiple={multiple}
              maxFiles={maxFiles}
            />
          </div>
        )}
        {types && types.find((el) => el.typeID === "2") && (
          <div className="col">
            <AttachedFiles
              type="2"
              name={titleNeeded ? "Shemas" : ""}
              accepted=".jpg, .jpeg, .png, .csv,.doc,.docx, application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onAddFile={onAddImage}
              onRemoveFile={onRemoveImage}
              attachedFiles={attachedSchemas}
              multiple={multiple}
              maxFiles={maxFiles}
            />
          </div>
        )}
        {types && types.find((el) => el.typeID === "3") && (
          <div className="col">
            <AttachedFiles
              type="3"
              name={titleNeeded ? "Docs" : ""}
              accepted=".jpg, .jpeg, .png, .csv,.doc,.docx, application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              attachedFiles={attachedDocs}
              onAddFile={onAddImage}
              onRemoveFile={onRemoveImage}
              multiple={multiple}
              maxFiles={maxFiles}
            />
          </div>
        )}
      </div>
    </>
  );
};
AttachmentList.propTypes = {
  titleNeeded: PropTypes.bool,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  types: PropTypes.arrayOf(
    PropTypes.shape({
      typeID: PropTypes.string,
    })
  ),
  onAddFileServer: PropTypes.func,
  onRemoveFileServer: PropTypes.func,
  setCreatedFiles: PropTypes.func,
  fileType: PropTypes.string,
};
export default AttachmentList;
