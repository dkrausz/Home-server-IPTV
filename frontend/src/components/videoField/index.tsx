import type { UseFormRegister } from "react-hook-form";

export interface videoInterface {
  video: {
    file?: FileList;
    category: string;
    name: string;
    folder: string;
  }[];
}

interface VideoFieldProps {
  register: UseFormRegister<videoInterface>;
  videoNumber: number;
}

export function VideoField({ register, videoNumber }: VideoFieldProps) {
  console.log("videoNumber", videoNumber);
  return (
    <li className="flex flex-col justify-center items-center gap-8 w-full border-stone-400/50 border-3 rounded-xl p-6">
      <div className="w-2/3 flex justify-between">
        <label htmlFor="videoFile" className="text-stone-400">
          Escolha o video
        </label>
        <input
          id="videoFile"
          type="file"
          className="text-stone-400 border-stone-400/50 border-3 rounded-xl h-8 w-96 px-1 hover:border-stone-300/50"
          {...register(`video.${videoNumber}.file`)}
        />
      </div>
      <div className="w-2/3  flex justify-between">
        <label htmlFor="category" className="text-stone-400 ">
          Categoria
        </label>
        <input
          id="category"
          type="text"
          className="text-stone-400 border-stone-400/50 border-3 rounded-xl h-8 w-96 px-1  hover:border-stone-300/50"
          {...register(`video.${videoNumber}.category`)}
        />
      </div>
      <div className="w-2/3 flex justify-between">
        <label htmlFor="name" className="text-stone-400 ">
          Nome
        </label>
        <input
          id="name"
          type="text"
          className="text-stone-400 border-stone-400/50 border-3 rounded-xl h-8 w-96 px-1  hover:border-stone-300/50"
          {...register(`video.${videoNumber}.name`)}
        />
      </div>
      <div className="w-2/3  flex justify-between">
        <label htmlFor="folder" className="text-stone-400 ">
          Nome da pasta
        </label>
        <input
          id="folder"
          type="text"
          className="text-stone-400 border-stone-400/50 border-3 rounded-xl h-8 w-96 px-1  hover:border-stone-300/50"
          {...register(`video.${videoNumber}.folder`)}
        />
      </div>
    </li>
  );
}
