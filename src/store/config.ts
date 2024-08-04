import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BASE_PATH } from '@/utils/const'

export interface InitialState {
  isCollapsed: boolean
  base: string
  entryPath: string[]
}

export const initialState: InitialState = {
  isCollapsed: false,
  base: BASE_PATH,
  entryPath: [BASE_PATH],
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed
    },

    setBase: (state, { payload }: PayloadAction<string>) => {
      state.base = payload
    },

    setEntryPath: (state, { payload }: PayloadAction<string>) => {
      state.entryPath = [...state.entryPath, payload]
    },
  },
})

export const { setCollapsed, setBase, setEntryPath } = configSlice.actions

export default configSlice.reducer
