import { useSelector, useDispatch } from 'react-redux'
import { State, Dispatch } from './index'

export const useAppSelector = useSelector.withTypes<State>()
export const useAppDispatch = useDispatch.withTypes<Dispatch>()
