import {createActorContext} from "@xstate/react";

import QuizMachine from './machine/QuizMachine.ts'

export default createActorContext(QuizMachine);