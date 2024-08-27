import { UrlState } from '@/context';
import { createUrl } from '@/db/apiUrls';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from "zod";
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

import Error from './error';
import { Card } from './ui/card';
import { BeatLoader } from 'react-spinners';
import { QRCode } from 'react-qrcode-logo';
import { Input } from './ui/input';


export function CreateLink() {
    const {user} = UrlState();
  
    const navigate = useNavigate();
    const ref = useRef();
  
    let [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");
  
    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
      title: "",
      longUrl: longLink ? longLink : "",
      customUrl: "",
    });
  
    const schema = z.object({
        title: z.string().min(1, { message: "Title is required" }),
        longUrl: z.string().url({ message: "Must be a valid URL" }).min(1, { message: "Long URL is required" }),
        customUrl: z.string().optional(),
      });
  
    const handleChange = (e) => {
      setFormValues({
        ...formValues,
        [e.target.id]: e.target.value,
      });
    };
  
    const {
      loading,
      error,
      data,
      fn: fnCreateUrl,
    } = useFetch(createUrl, {...formValues, user_id: user.id});
  
    useEffect(() => {
      if (error === null && data) {
        navigate(`/link/${data[0].id}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, data]);
  
    const createNewLink = async () => {
      setErrors([]);
      try {
        const result = schema.safeParse(formValues);

        if (!result.success) {
            console.log(result.error.format()); // Format the errors as needed
        }
  
        const canvas = ref.current.canvasRef.current;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
  
        await fnCreateUrl(blob);
      } catch (e) {
        const newErrors = {};
  
        e?.inner?.forEach((err) => {
          newErrors[err.path] = err.message;
        });
  
        setErrors(newErrors);
      }
    };
  
    return (
      <Dialog
        defaultOpen={longLink}
        onOpenChange={(res) => {
          if (!res) setSearchParams({});
        }}
      >
        <DialogTrigger asChild>
          <Button variant="destructive">Create New Link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
          </DialogHeader>
          {formValues?.longUrl && (
            <QRCode ref={ref} size={250} value={formValues?.longUrl} />
          )}
  
          <Input
            id="title"
            placeholder="Short Link's Title"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors.title && <Error message={errors.title} />}
          <Input
            id="longUrl"
            placeholder="Enter the long URL here"
            value={formValues.longUrl}
            onChange={handleChange}
          />
          {errors.longUrl && <Error message={errors.longUrl} />}
          <div className="flex items-center gap-2">
            <Card className="p-2">snapurl.cloud</Card> /
            <Input
              id="customUrl"
              placeholder="Custom Link (optional)"
              value={formValues.customUrl}
              onChange={handleChange}
            />
          </div>
          {error && <Error message={errors.message} />}
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={createNewLink}
              disabled={loading}
            >
              {loading ? <BeatLoader size={10} color="gray" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }