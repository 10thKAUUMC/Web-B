import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "../utils/schemas";

import { useAuth }
from "../context/AuthContext";

import { useLocalStorage }
from "../hooks/useLocalStorage";

import { useGoogleLogin }
from "@react-oauth/google";

export default function LoginPage() {
  const navigate =
    useNavigate();

  const {
    login,
    accessToken,
    setAuthToken,
  } = useAuth();

  const [
    ,
    setUserName,
  ] =
    useLocalStorage<
      string | null
    >(
      "userName",
      null
    );

  const [
    ,
    setToken,
  ] =
    useLocalStorage<
      string | null
    >(
      "accessToken",
      null
    );

  useEffect(() => {
    if (
      accessToken
    ) {
      navigate(
        "/",
        {
          replace:
            true,
        }
      );
    }
  }, [
    accessToken,
  ]);

  // 🔥 Google Login
  const googleLogin =
    useGoogleLogin({
      onSuccess:
        (
          tokenResponse
        ) => {
          console.log(
            tokenResponse
          );

          // 🔥 핵심
          setAuthToken(
            tokenResponse.access_token
          );

          setToken(
            tokenResponse.access_token
          );

          setUserName(
            "google-user"
          );

          navigate(
            "/",
            {
              replace:
                true,
            }
          );
        },

      onError:
        () => {
          alert(
            "Google 로그인 실패"
          );
        },
    });

  // 일반 로그인
  const {
    register,
    handleSubmit,
    formState:
      {
        isValid,
      },
  } =
    useForm<LoginFormData>(
      {
        resolver:
          zodResolver(
            loginSchema
          ),

        mode:
          "onChange",
      }
    );

  const onSubmit =
    async (
      data:
        LoginFormData
    ) => {
      await login(
        data
      );

      setUserName(
        data.email.split(
          "@"
        )[0]
      );

      navigate(
        "/",
        {
          replace:
            true,
        }
      );
    };

  return (
    <div
      className="
        flex-1
        flex
        flex-col
        items-center
        justify-center
        bg-black
        text-white
      "
    >
      <h1 className="text-2xl mb-6">
        로그인
      </h1>

      {/* Google Login */}
      <button
        onClick={() =>
          googleLogin()
        }
        className="
          bg-white
          text-black
          px-4
          py-2
          rounded
          mb-4
        "
      >
        Google 로그인
      </button>

      <div className="text-gray-400 mb-4">
        OR
      </div>

      {/* 일반 로그인 */}
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="
          flex
          flex-col
          gap-3
        "
      >
        <input
          placeholder="email"
          {...register(
            "email"
          )}
          className="
            p-2
            bg-transparent
            border
          "
        />

        <input
          type="password"
          placeholder="password"
          {...register(
            "password"
          )}
          className="
            p-2
            bg-transparent
            border
          "
        />

        <button
          disabled={
            !isValid
          }
          className="
            bg-pink-500
            p-2
          "
        >
          로그인
        </button>
      </form>
    </div>
  );
}