import { useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const Vote = ({ competitorId }) => {
    const [votes, setVotes] = useState({ flavor: 0, looks: 0 });
    const db = getFirestore();

    const handleVote = async (category) => {
        const voteDoc = doc(db, "competitors", competitorId);
        await updateDoc(voteDoc, {
            [category]: votes[category] + 1,
        });
        setVotes((prev) => ({ ...prev, [category]: prev[category] + 1 }));
    };

    return (
        <div>
            <button onClick={() => handleVote("flavor")}>Vote for Flavor</button>
            <button onClick={() => handleVote("looks")}>Vote for Looks</button>
        </div>
    );
};

export default Vote;
