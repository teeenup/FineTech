import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  amount: number;
  description: string | undefined;
  user: string;
  name: string;
  type: string;
  date: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  type: string;
  amount: number;
}

interface TransactionsState {
  transactions: Transaction[];
  categories: Category[];
}

const initialState: TransactionsState = {
  transactions: [],
  categories: [],
};

const transSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    },
    allTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    allCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  allTransactions,
  allCategories,
} = transSlice.actions;
export type { Transaction, Category };

export default transSlice.reducer;
