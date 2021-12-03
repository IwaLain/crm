import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "reactstrap";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./Previews.scss";

const AttachedFiles = ({
  type,
  name,
  onAddFile,
  attachedFiles,
  onRemoveFile,
  onDeleteAllFiles,
  accepted,
}) => {
  const [files, setFiles] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [removeFile, setRemoveFile] = useState();
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: accepted,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const newAcceptedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      onAddFile(newAcceptedFiles, type);
    },
  });
  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));

    setFiles([
      ...attachedFiles.map((file) => {
        const fileExtension = file.img.substring(file.img.lastIndexOf("."));
        const imageTypes = [".jpeg", ".png", ".jpg"];
        const isImage = imageTypes.some((el) => fileExtension.includes(el));
        return {
          name: file.img,
          preview: process.env.REACT_APP_SERVER_URL + "/" + file.img,
          id: file.id,
          isImage: isImage,
        };
      }),
    ]);
  }, [attachedFiles]);

  const thumbs =
    files &&
    files.length > 0 &&
    files.map((file) => (
      <div
        className="thumb"
        key={file.id}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span
          className="attached--remove-img"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setRemoveFile(file);
            toggleConfirmModal();
          }}
        ></span>
        <div className="thumbInner">
          {file.isImage === true ? (
            <img src={file.preview} className="attached--img" alt="..." />
          ) : (
            <i className="far fa-file  fa-4x"></i>
          )}
        </div>
      </div>
    ));

  return (
    <>
      <ConfirmModal
        modal={confirmModal}
        toggleModal={toggleConfirmModal}
        title="Remove image"
        handleSubmit={() => {
          if (removeFile === "all") {
            onDeleteAllFiles(type);
          } else {
            onRemoveFile(removeFile, type);
          }
        }}
        modalText={`Are you sure you want to DELETE file`}
      />
      <h3 className="page-subtitle fw-normal">{name && name}</h3>
      <div
        {...getRootProps({
          className:
            "dropzone " +
            (files && files.length > 0 ? "" : "dropzone--placeholder"),
        })}
      >
        {/* <Button
          className="delete-file--btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setRemoveFile("all");
            toggleConfirmModal();
          }}
        >
          Delete all {name}
        </Button>
        <Button
          className="upload-file--btn"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Upload {name}
        </Button> */}
        <input {...getInputProps()} />

        <div className="thumbsContainer">
          {thumbs ? (
            thumbs
          ) : (
            <span className="dropzone--placeholder-text">
              Drag 'n' drop some files here, or click to select files
            </span>
          )}
          {thumbs && (
            <div
              className="thumb"
              onClick={() => {
                open();
              }}
            >
              <button className="dropzone--add-file-btn btn ">
                <i class="fas fa-plus fa-2x add-file-btn--icon"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default AttachedFiles;
// {
//   files && files.length > 0 ? (
//     files.map((file) => (
//       <div
//         className="thumb"
//         key={file.id}
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}
//       >
//         <span
//           className="attached--remove-img"
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             setRemoveFile(file);
//             toggleConfirmModal();
//           }}
//         ></span>
//         <div className="thumbInner">
//           {file.isImage === true ? (
//             <img src={file.preview} className="attached--img" alt="..." />
//           ) : (
//             <i className="far fa-file  fa-4x"></i>
//           )}
//         </div>
//       </div>
//     ))
//   ) : (
//     <span className="dropzone--placeholder-text">
//       Drag 'n' drop some files here, or click to select files
//     </span>
//   );
// }
