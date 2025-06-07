import { NextFunction, Request, Response } from "express";
import cloudinaryImg from "../../config/cloudinary";
import { Book } from "../../Model/Book.models";

const createBookRestController=async (
    req:Request,
    res:Response,
    next:NextFunction
  ) => {

    try {
       let existingImages = {};
        if (Array.isArray(req.files) && req.files.length > 0) {
          const urlPath = req.files[0].path
          const q = urlPath.split(".")[2].split("/")
          const PublicID = q[q.length - 2].concat("/", q[q.length - 1])
    
          existingImages = {
            imageUrl: urlPath,
            imgPublicId: PublicID
          }
          req.body.image = existingImages;

          
        }
const newBook=new  Book(req.body)
const data =await newBook.save()
res.status(200).json({
  data: data,
  meta: {message:{title:"Book created Successfully",status:200}},
  error: null,
});
    } catch (error) {
      console.log("error4",error);
      
        next(error)
    }
  }

const getBookRestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query["page[number]"] as string) || 1;
    const limit = parseInt(req.query["page[size]"] as string) || 10;

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find()
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email profileImage userFirstName userLastName'), // 👈 populate 'user', and you can select fields if needed
      Book.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: books,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
        message: { status: 200, title: "Book Fetched Successfully" },
      },
      links: {
        self: `${req.baseUrl}${req.path}?page[number]=${page}&page[size]=${limit}`,
        next:
          page < totalPages
            ? `${req.baseUrl}${req.path}?page[number]=${page + 1}&page[size]=${limit}`
            : null,
        prev:
          page > 1
            ? `${req.baseUrl}${req.path}?page[number]=${page - 1}&page[size]=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.log("error5", error);
    next(error);
  }
};

const deleteBookRestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book) {
       res.status(404).json({
        errors: [
          {
            status: "404",
            title: "Not Found",
            detail: `Book with ID ${bookId} not found.`,
          },
        ],
      });
      return
    }

    await book.deleteOne();

    res.status(204).send();
  } catch (error) {
       console.log("error6",error)

    next(error);
  }
};
  export{createBookRestController,getBookRestController,deleteBookRestController}