import { createContext } from "react";

const IsInPersonContext = createContext({
    isInPerson: true,
    toggleIsInPerson: {}
});

export const IsInPersonProvider = IsInPersonContext.Provider;
export const IsInPersonConsumer = IsInPersonContext.Consumer;

export default IsInPersonContext;