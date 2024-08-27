import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {

  const [longURL, setLongURL] = useState();
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longURL) navigate(`/auth?createNew=${longURL}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold'>The percent URL Shortener <br /> for all your needs! 🧌</h2>
      <form onSubmit={handleShorten} className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
        <Input type="url" value = {longURL} placeholder="Enter the long URL here" onChange = {(e) => setLongURL(e.target.value)} className="h-full flex-1 py-4 px-4" />
        <Button className="h-full" type="submit" variant="destructive">Shorten</Button>
      </form>
      <img src='/banner2.jpeg' alt='SnapURL Banner' className='w-full my-11 md:px-11'/>
      <Accordion type="multiple" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the SnapURL function?
          </AccordionTrigger>
          <AccordionContent>
            When you input a lengthy URL, our system creates a shorter link. 
            This short link will direct users back to the original URL when clicked.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Is an account required to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes, creating an account lets you manage your URLs,
            access analytics, and customize your short links.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics can I access for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can see the number of clicks, geolocation data, and 
            device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      

    </div>
  )
}

export default LandingPage 