import express, {Request, Response} from "express" ;
import { accessSync } from "fs";
import multer from "multer";
import cloudinary from "cloudinary"
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
const router =express.Router();

const storage=multer.memoryStorage();// store img in memory
const upload=multer({
    storage:storage,
    limits:{
        fileSize:5 * 1023 * 1024  //5MB
    }
})

//api/my-hotels
router.post("/", verifyToken,
     [body("name").notEmpty().withMessage("Name is Required")],
     [body("city").notEmpty().withMessage("City is Required")],
     [body("country").notEmpty().withMessage("Country is Required")],
     [body("description").notEmpty().withMessage("Description is Required")],
     [body("type").notEmpty().withMessage("Hotel is Required")],
     [body("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("price per night is  is Required and must be a number")],
     [body("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities are required")],
    upload.array("imageFiles", 6) ,
    async (req:Request, res:Response)=>{
    try{
        //here we ll get all the image
      const imageFiles=req.files as Express.Multer.File[];
      //here we'll get all the other property
      const newHotel=req.body;

      //1.Upload the image to the cloudinary
      const uploadPromises=imageFiles.map(async(image)=>{
        //encode the image as base 64  string
        const b64=Buffer.from(image.buffer).toString("base64")
        let dataURI="data:" + image.mimetype + ";base64," +b64;
        const res=await cloudinary.v2.uploader.upload(dataURI)
        return res.url;
      })
       
      // this will wait till all the image is uplaod on the cloudinary and then will give us url
      const imageUrls=await Promise.all(uploadPromises)

      //2.If upload was successful , add the URLs to the new hotel
      newHotel.imageUrls=imageUrls;
      newHotel.lastUpdated=new Date();
      newHotel.userId=req.userId;

      //3.save the new hotel in our database
      const hotel=new Hotel(newHotel);
      await hotel.save();

      //4.return a 201 status
      res.status(201).send(hotel);
    }
    catch(e){
      console.log("Error creating hotel :", e);
      res.status(500).json({message:"Something went wrong"});
    }
})

export default router