import regularActions from "./regularActions";
import iregularActions from "./iregularActions";
import { action } from '../types/action';

const ACTIONS: action[] = [...regularActions, ...iregularActions];

export default ACTIONS;
