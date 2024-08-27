import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Error from "./error"
import {BeatLoader} from "react-spinners";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import { z , ZodError} from "zod";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { logindb } from "@/db/apiAuth";
import { UrlState } from "@/context";


const login = () => {

    let [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");
  
    const navigate = useNavigate();
  
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleInputChange = (e) => {
      const {name, value} = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const { loading, error, fn: fnLogin, data } = useFetch(logindb, formData); // login callback is imported from apiAuth.jsx in db, formData consists of email and password
    const { fetchUser } = UrlState();
  
    useEffect(() => {
      if (error === null && data) {
        fetchUser();
        navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, data]);
  
    const handleLogin = async () => {
      setErrors([]);
      try {
        const schema = z.object({
            email: z.string().email('Invalid email address').min(1,'Email is required'), // Required field with validation
            password: z.string().min(6, 'Password must be at least 6 characters long'),
        });
  
        schema.safeParse(formData);
        await fnLogin();
      } catch (e) {
        if (e instanceof ZodError) {
            const newErrors = {};
        
            e.errors.forEach((err) => {
              if (err.path) {
                newErrors[err.path.join('.')] = err.message;
              }
            });
        
            setErrors(newErrors);
          } else {
            // Handle other types of errors if necessary
            console.error("Unexpected error:", e);
          }
      }
    };

    return (
        <Card>
            <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
                to your account if you already have one
            </CardDescription>
            {error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className="space-y-2">
            <div className="space-y-1">
                <Input
                name="email"
                type="email"
                placeholder="Enter Email"
                onChange={handleInputChange}
                />
            </div>
            {errors.email && <Error message={errors.email} />}
            <div className="space-y-1">
                <Input
                name="password"
                type="password"
                placeholder="Enter Password"
                onChange={handleInputChange}
                />
            </div>
            {errors.password && <Error message={errors.password} />}
            </CardContent>
            <CardFooter>
            <Button onClick={handleLogin}>
                {loading ? <BeatLoader size={10} color="#47476b" /> : "Login"}
            </Button>
            </CardFooter>
        </Card>
   )
}

export default login