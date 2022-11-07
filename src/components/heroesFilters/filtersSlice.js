import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter({
    selectId: (state) => state.element
})

const initialState = filtersAdapter.getInitialState({
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})


export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp();
        return request('http://localhost:3001/filters')
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersActiveChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filtersLoadingStatus = 'loading'
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload)
                // state.filters = action.payload
            })
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
})

const { actions, reducer } = filtersSlice;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export default reducer;

export const {
    filtersActiveChanged
} = actions;