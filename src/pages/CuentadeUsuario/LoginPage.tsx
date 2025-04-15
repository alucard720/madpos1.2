import React from "react";
import * as Yup from "yup";
import "./useraccount.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserAuth } from "../../contexts/userAuth"; 
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock, faChevronRight} from "@fortawesome/free-solid-svg-icons";


type SignupFormData = {
  email: string;
  password: string;
};
const signupSchema = Yup.object().shape({
  email: Yup.string().required("Correo Requerido").email("Correo invalido"),
  password: Yup.string().trim().min(8, 'Debe tener minimo 8 letras').required("Contrasena requerida"),
});

const LoginPage: React.FC = () => {
  const { loginUser } = UserAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = (form: SignupFormData) => {
    loginUser(form.email, form.password);
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
        <div className="screen__img">
        <img src="/src/assets/madpos-logo.png" alt="Logo" className="logo" width={120} />  
        </div>           
          <form className="login" onSubmit={handleSubmit(onSubmit)}>
            <div className="login__field">            
              <i className="login__icon "> <FontAwesomeIcon icon={faEnvelope} style={{color:"black"}}/>              
              </i>
              <input
                type="text"
                className="login__input"
                autoComplete="off"
                placeholder="Correo electronico"
                {...register("email")}
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>          
            <div className="login__field">
              <i className="login__icon fas fa-lock"><FontAwesomeIcon icon={faLock} style={{color:"black"}}/>   </i>
              <input
                type="password"
                autoComplete="off"
                className="login__input"
                placeholder="Contraseña"
                {...register("password")}
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <button type="submit" className="button login__submit">
              <span className="button__text">ENTRAR AHORA</span>
              <i className="button__icon fas fa-chevron-right"><FontAwesomeIcon icon={faChevronRight} style={{color:"grey"}}/>  </i>            
            </button>
            <div className="screen_adv" style={{fontSize:"0.8rem"}}><p style={{color:"#1aae86", fontWeight:"bold"}}>No tienes Cuenta? <a href="/register" style={{color:"black"}}> Registrate Aqui!</a></p></div>
          </form>
          
          {/* <div className="social-login">
            <h3>Entra via</h3>
            <div className="social-icons">             
              <a href="#" className="fab fa-facebook"><FontAwesomeIcon icon ={faFacebook} style={{fontSize:"30px", color:"white"}} /></a>
              <a href="#" className="fab fa-twitter"><FontAwesomeIcon icon ={faTwitter} style={{fontSize:"30px", color:"white"}} /></a>
              <a href="#" className="fab fa-google"> <FontAwesomeIcon icon ={faGoogle} style={{fontSize:"30px", color:"white"}} /></a>
            </div>
           
          </div> */}
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
