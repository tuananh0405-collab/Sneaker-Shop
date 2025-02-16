import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/interface";
interface CategoryState {
  categories: Category[];
  categoryDetails: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  categoryDetails: null,
  loading: false,
  error: null,
};

const API_BASE_URL = "http://192.168.57.105:5501/api/v1/category";

// Fetch all categories
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchCategories",
  async () => {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    return data.data.categories;
  }
);

// Fetch category details
export const fetchCategoryDetails = createAsyncThunk<Category, string>(
  "categories/fetchCategoryDetails",
  async (categoryId) => {
    const response = await fetch(`${API_BASE_URL}/${categoryId}`);
    const data = await response.json();
    return data.data.category;
  }
);

// Create a new category
export const createCategory = createAsyncThunk<Category, Partial<Category>>(
  "categories/createCategory",
  async (categoryData) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data.data.category;
  }
);

// Update a category
export const updateCategory = createAsyncThunk<Category, { categoryId: string; categoryData: Partial<Category> }>(
  "categories/updateCategory",
  async ({ categoryId, categoryData }) => {
    const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data.data.category;
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk<string, string>(
  "categories/deleteCategory",
  async (categoryId) => {
    await fetch(`${API_BASE_URL}/${categoryId}`, {
      method: "DELETE",
    });
    return categoryId;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load categories";
      })
      
      // Fetch category details
      .addCase(fetchCategoryDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryDetails.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categoryDetails = action.payload;
      })
      .addCase(fetchCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load category details";
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create category";
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update category";
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter((category) => category._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

export default categorySlice.reducer;