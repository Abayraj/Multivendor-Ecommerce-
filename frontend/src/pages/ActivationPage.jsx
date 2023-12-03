import React, { useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "../server";

const ActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axiosInstance.post("/api/v2/user/activation", {
                        activation_token,
                    });
                    console.log(res.data.message);
                } catch (error) {
                    console.log(error.response.data.message);
                    setError(true);
                }
            };
            activationEmail();
        }
    }, []);
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
          {
            error?(
              <p> Your token is expired</p>
            ) :(<p>Your account has been created sucessfuly</p>)
              
            
          }
        </div>
    );
};

export default ActivationPage;
