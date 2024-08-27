import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Error from "./error"
import { BeatLoader } from "react-spinners";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z , ZodError} from "zod";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { signupdb } from "@/db/apiAuth";
import { UrlState } from "@/context";


const signup = () => {

  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signupdb, formData); // login callback is imported from apiAuth.jsx in db, formData consists of email and password
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = z.object({
          name: z.string().min(1,'Name is required'),
          email: z.string().email('Invalid email address').min(1,'Email is required'), // Required field with validation
          password: z.string().min(6, 'Password must be at least 6 characters long'),
          profile_pic: z
          .any()
          .refine((files) => {
            return files?.[0]?.size <= 1024 * 1024 * 5;
          }, `Max image size is 5MB.`)
          .refine(
            (files) => [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
          ),
      });

      schema.safeParse(formData);
      await fnSignup();
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
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            for a new account if you don&rsquo;t have one yet.
          </CardDescription>
          {error && <Error message={error.message} />}
          </CardHeader>
          <CardContent className="space-y-2">
          <div className="space-y-1">
              <Input
              name="name"
              type="text"
              placeholder="Enter Name"
              onChange={handleInputChange}
              />
          </div>
          {errors.name && <Error message={errors.name} />}
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
          <div className="space-y-1">
              <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              />
          </div>
          {errors.profile_pic && <Error message={errors.profile_pic} />}
          </CardContent>
          <CardFooter>
          <Button onClick={handleSignup}>
              {loading ? <BeatLoader size={10} color="#47476b" /> : "Create an account"}
          </Button>
          </CardFooter>
      </Card>
 )
}

export default signup