import { useState } from "react";
import { VideoField, type videoInterface } from "../videoField";
import { FaPlusCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";

export function UploadForm() {
  const [numberOfFields, setNumberOfFields] = useState(1);
  const { register, handleSubmit } = useForm<videoInterface>();

  const handleAddOneMore = () => {
    setNumberOfFields(numberOfFields + 1);
  };

  const submit = (data: videoInterface) => {
    console.log(data);
    const formData = new FormData();
    data.video.forEach((item) => {
      formData.append("name", item.name);
      formData.append("category", item.category);
      formData.append("video", item.file[0]);
    });

    console.log(formData);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  return (
    <form
      className="max-w-4xl w-full my-8 bg-sky-950/20 flex flex-col rounded-3xl p-8 items-center relative"
      encType="multipart/form-data"
      onSubmit={handleSubmit(submit)}
    >
      <h2 className="text-stone-400 text-3xl my-4">Upload de video</h2>
      <ul className="w-full mt-12 flex flex-col gap-4">
        {Array.from({ length: numberOfFields }).map((_, index) => (
          <VideoField key={index} register={register} videoNumber={numberOfFields} />
        ))}
      </ul>
      <div
        className="group border-stone-400/50 border-2 rounded-xl w-24 p-1 flex flex-col items-center absolute right-4 top-4 hover:border-stone-300/50 cursor-pointer"
        onClick={handleAddOneMore}
      >
        <FaPlusCircle size={40} className="text-stone-400/50 text-center group-hover:text-stone-300/50 transition-colors" />
        <span className="text-stone-400/50 text-center group-hover:text-stone-300/50 transition-colors">Adicionar outro</span>
      </div>
      <button className="w-full h-12 my-8 bg-sky-800/20 border-stone-400/50 border-3 rounded-xl text-stone-400/50 text-center hover:text-stone-100/50 hover:border-stone-100/50 hover:bg-sky-700/20 transition-colors cursor-pointer text-2xl">
        Enviar
      </button>
    </form>
  );
}
