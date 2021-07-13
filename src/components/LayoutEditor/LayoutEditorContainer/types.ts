import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { LayoutEditorState } from '../models';

/* --- STATE --- */

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type ContainerState = LayoutEditorState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
