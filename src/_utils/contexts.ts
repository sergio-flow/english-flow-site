import { createContext } from 'react';
import allTexts from './allTexts';

export const TranslationsContext = createContext(allTexts);
export const UserContext = createContext(null);