import * as ReactDOM from 'react-dom';
import { EntryFactory } from '~/rmxgun-context/context';

let RmxGun = EntryFactory();
// @ts-ignore
ReactDOM.hydrateRoot(document, <RmxGun.Client />);
