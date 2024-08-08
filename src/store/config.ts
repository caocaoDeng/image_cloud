import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getDevice } from '@/utils'
import { BASE_PATH } from '@/utils/const'

export interface InitialState {
  isMobile: boolean
  theme: 'dark' | 'light'
  isCollapsed: boolean
  base: string
  entryPath: string[]
}

export type ContentAction = 'replace' | 'push'

export const initialState: InitialState = {
  isMobile: !!getDevice(),
  theme: 'dark',
  isCollapsed: !!getDevice(),
  base: BASE_PATH,
  entryPath: [BASE_PATH],
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setIsMobile: (state, { payload }: PayloadAction<boolean>) => {
      state.isMobile = payload
    },
    setTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },

    setCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed
    },

    setBase: (state, { payload }: PayloadAction<string>) => {
      state.base = payload
    },

    setEntryPath: (
      state,
      action: PayloadAction<{
        actionType?: ContentAction
        entryPath: string[] | string
      }>
    ) => {
      const { actionType = 'push', entryPath } = action.payload
      if (actionType === 'push') {
        state.entryPath = [...state.entryPath, entryPath as string]
      } else {
        state.entryPath = entryPath as string[]
      }
    },
  },
})

export const { setIsMobile, setTheme, setCollapsed, setBase, setEntryPath } =
  configSlice.actions

export default configSlice.reducer
