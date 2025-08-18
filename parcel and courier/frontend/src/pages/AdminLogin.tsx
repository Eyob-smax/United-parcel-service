import Form from "@/components/Form";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { TAppDispatch } from "@/app/store";
import { setUser } from "@/features/userSlice";
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const dispatch = useDispatch<TAppDispatch>();
  const { t } = useTranslation();
  function handleLogin() {
    if (username === "admin" && password === "admin123") {
      Swal.fire({
        title: t("alerts.login_successful"),
        text: t("alerts.welcome_message"),
        icon: "success",
        background: "#232110",
        color: "#bbba9b",
      }).then(() => {
        dispatch(
          setUser({
            username: "admin",
            authenticated: true,
          })
        );
        localStorage.setItem("token", "true");
        navigate("/admin-dashboard");
      });
    } else {
      Swal.fire({
        title: t("alerts.login_failed"),
        text: t("alerts.invalid_credentials"),
        icon: "error",
        background: "#232110",
        color: "#bbba9b",
      });
    }
  }
  return (
    <Form
      key={"admin_login"}
      username={username}
      setUsername={setUsername}
      forWhich="admin_login"
      password={password}
      setPassword={setPassword}
      onContinue={handleLogin}
    />
  );
}
