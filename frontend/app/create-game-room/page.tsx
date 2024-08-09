"use client";

import { createRoom, getCentrifugeToken } from "@/actions";
import appConfig from "@/config/appConfig";
import { emptyContext, useAuthContext } from "@/context/AuthContext";
import { Centrifuge } from "centrifuge";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormFields = {
  name: string;
};

const CreateGameRoom = () => {
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const { user, setUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>();
  const watchForName = watch("name", "");
  const router = useRouter();

  useEffect(() => {
    const IsFormValid = watchForName.length > 5;
    setFormIsValid(IsFormValid);
  }, [watchForName]);

  async function onSubmit(data: FormFields) {
    setLoading(true);

    try {
      const roomVersion = 1;
      const result = await createRoom(
        data.name,
        roomVersion,
        user.access_token
      );
      const roomId = result.data.id;
      console.log("Result of create game", result)
      console.log("Game room id", result.data.id)
      
      router.push(`/join-game/${roomId}`);
    } catch (error) {
      setErrMessage((error as any).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full justify-center items-center min-h-screen bg-primary flex flex-col ">
      <form
        className="flex w-full shadow-custom-inset flex-col gap-8 px-4 md:px-8 py-10 rounded-lg bg-white md:w-[40%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-[24px] text-heading-m text-black font-bold">
            Create Game
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name">Team name</label>
            <div className="flex items-center gap-2 relative w-full rounded-md border">
              <input
                className={`outline-none flex-1 relative border-gray px-4 p-4 focus:ring-1 focus:ring-primary rounded-lg ${
                  errors.name && "border-red focus:ring-0 border"
                }`}
                {...register("name", {
                  required: "Cannot be empty",
                })}
                placeholder="Jungle justice"
                type="text"
              />
              {errors.name && (
                <p className="text-red text-[12px] absolute right-2 top-[32%]">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {errMessage && (
          <p className="text-red text-[18px] pb-2">{errMessage}</p>
        )}
        <button
          type="submit"
          className="bg-primary-yellow border-secondary border shadow-custom-inset p-[11px] rounded-lg text-[18px] text-white"
        >
          {loading ? "Loading..." : "Create Game Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateGameRoom;
