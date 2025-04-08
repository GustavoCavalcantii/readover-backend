import mongoose, { Schema, Types } from "mongoose";
import { ILoan } from "../interfaces/ILoan";
import { BookStatus } from "../enums/Book/BookStatus";


const loanSchema = new Schema<ILoan>({
  userId: { type: Types.ObjectId, required: true, ref: "User" },
  bookId: { type: Types.ObjectId, required: true, ref: "Book" },
  status: { type: String, enum: Object.values(BookStatus), default: BookStatus.PENDING },
  loanDate: { type: Date, required: true, default: Date.now },
  expectedReturnDate: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      today.setDate(today.getDate() + 30);
      return today;
    },
  },
  actualReturnDate: { type: Date, required: false, default: null },
}, {
});

const Loan = mongoose.model<ILoan>("Loan", loanSchema);

export default Loan;
