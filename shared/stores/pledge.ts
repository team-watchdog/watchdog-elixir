import create,{ GetState, SetState } from "zustand";
import { persist, StoreApiWithPersist } from "zustand/middleware";

import { Pledge } from "../types";

type PledgeStoreState = {
    pledge: Pledge;
    setPledge: (pledge: Pledge) => void;
    resetPledge: () => void;
}

const newPledge = {

} as Pledge;

export const pledgeStore = create<PledgeStoreState, SetState<PledgeStoreState>, GetState<PledgeStoreState>, StoreApiWithPersist<PledgeStoreState> >(persist(
	(set) => ({
		pledge: newPledge,

		setPledge: (pledge: Pledge) => {
			set({
				pledge,
			});
		},
        resetPledge: () => {
            set({
                pledge: newPledge,
            });
        },
	}),{ 
		name: "elixir-pledge-store",
	}
));