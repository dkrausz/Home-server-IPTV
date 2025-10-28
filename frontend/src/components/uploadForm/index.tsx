import { useEffect, useState } from "react";
import { VideoField, type videoInterface } from "../videoField";
import { FaPlusCircle } from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
import { UploadApi } from "../../services/api";

export function UploadForm() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<videoInterface>({ defaultValues: { video: [{ file: undefined, category: "", name: "", folder: "" }] } });

  const { fields, append } = useFieldArray({
    control,
    name: "video",
  });

  const handleAddOneMore = () => {
    console.log("add onother");
    append({ file: undefined, category: "", name: "", folder: "" });
  };

  const submit = async (data: videoInterface) => {
    console.log("data", data);
    const formData = new FormData();
    data.video.forEach((item) => {
      console.log("item", item);
      formData.append("name", item.name);
      formData.append("category", item.category);
      formData.append("folderName", item.folder);
      if (item.file) {
        formData.append("video", item.file[0]);
      }
    });

    try {
      await UploadApi.post("/uploads", formData, {
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(uploadProgress);
  }, [uploadProgress]);

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <form
      className="max-w-4xl w-full my-8 bg-sky-950/20 flex flex-col rounded-3xl p-8 items-center relative"
      encType="multipart/form-data"
      onSubmit={handleSubmit(submit)}
    >
      <h2 className="text-stone-400 text-3xl my-4">Upload de video</h2>

      <ul className="w-full mt-12 flex flex-col gap-4">
        {fields.map((field, index) => (
          <VideoField key={field.id} register={register} videoNumber={index} />
        ))}
      </ul>

      <div
        className="group border-stone-400/50 border-2 rounded-xl w-24 p-1 flex flex-col items-center absolute right-4 top-4 hover:border-stone-300/50 cursor-pointer"
        onClick={handleAddOneMore}
        role="button"
      >
        <FaPlusCircle size={40} className="text-stone-400/50 text-center group-hover:text-stone-300/50 transition-colors" />
        <span className="text-stone-400/50 text-center group-hover:text-stone-300/50 transition-colors">Adicionar outro</span>
      </div>
      {isSubmitting && <p className="text-white">{uploadProgress}</p>}
      <button className="w-full h-12 my-8 bg-sky-800/20 border-stone-400/50 border-3 rounded-xl text-stone-400/50 text-center hover:text-stone-100/50 hover:border-stone-100/50 hover:bg-sky-700/20 transition-colors cursor-pointer text-2xl">
        Enviar
      </button>
    </form>
  );
}
