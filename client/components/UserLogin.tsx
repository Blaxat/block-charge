"use client";

import { login } from "@/redux/slice/authSlice";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const UserLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableButton(true);
    setLoading(true);

    console.log({ email, password });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login/user`,
        {
          email,
          password,
        }
      );

      console.log(response);

      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        dispatch(login(response.data.token));
        router.push("/map");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setDisableButton(false);
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <Input
        label="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        variant="bordered"
        isRequired
        isDisabled={disableButton}
      />
      <Input
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isRequired
        isDisabled={disableButton}
      />
      <Button
        className="font-bold text-lg"
        size="lg"
        type="submit"
        variant="shadow"
        color="primary"
        isDisabled={disableButton}
        isLoading={loading}
      >
        Login
      </Button>
    </form>
  );
};

export default UserLoginForm;
