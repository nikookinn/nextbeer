import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DateRangeType = 'CURRENT_WEEK' | 'LAST_WEEK' | 'CURRENT_MONTH' | 'LAST_MONTH' | 'HOURLY' | 'CUSTOM';

interface CustomDates {
  startDate: string | null; // Store as ISO string
  endDate: string | null;   // Store as ISO string
}

interface DashboardState {
  selectedRange: DateRangeType;
  customDates: CustomDates;
}

const initialState: DashboardState = {
  selectedRange: 'CURRENT_WEEK',
  customDates: {
    startDate: null,
    endDate: null,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedRange: (state, action: PayloadAction<DateRangeType>) => {
      state.selectedRange = action.payload;
    },
    setCustomDates: (state, action: PayloadAction<CustomDates>) => {
      state.customDates = action.payload;
      // Set range to CUSTOM when custom date is selected
      if (action.payload.startDate && action.payload.endDate) {
        state.selectedRange = 'CUSTOM';
      }
    },
    clearCustomDates: (state) => {
      state.customDates = {
        startDate: null,
        endDate: null,
      };
      // Return to default range when custom dates are cleared
      if (state.selectedRange === 'CUSTOM') {
        state.selectedRange = 'CURRENT_WEEK';
      }
    },
  },
});

export const { setSelectedRange, setCustomDates, clearCustomDates } = dashboardSlice.actions;
export default dashboardSlice.reducer;
