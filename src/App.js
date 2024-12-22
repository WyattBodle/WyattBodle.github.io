import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; // Firebase Firestore and Authentication
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const App = () => {
    const [competitors, setCompetitors] = useState([]);
    const [flavorVotes, setFlavorVotes] = useState([]); // Track selected competitors for Flavor
    const [looksVotes, setLooksVotes] = useState([]); // Track selected competitors for Looks
    const [hasSubmitted, setHasSubmitted] = useState(false); // Prevent multiple submissions

    // Check if the user has already submitted
    useEffect(() => {
        const submittedFlag = localStorage.getItem("hasSubmitted");
        if (submittedFlag) {
            setHasSubmitted(true);
        }

        signInAnonymously(auth)
            .then(() => console.log("Signed in anonymously"))
            .catch((error) => console.error("Error signing in:", error));

        fetchCompetitors();
    }, []);

    // Fetch competitors from Firestore
    const fetchCompetitors = async () => {
        const querySnapshot = await getDocs(collection(db, "competitors"));
        const competitorsData = [];
        querySnapshot.forEach((doc) => {
            competitorsData.push({ id: doc.id, ...doc.data() });
        });
        setCompetitors(competitorsData);
    };

    // Handle selecting a vote
    const handleVote = (competitorId, voteType) => {
        if (voteType === "flavor") {
            if (flavorVotes.includes(competitorId)) {
                setFlavorVotes(flavorVotes.filter((id) => id !== competitorId));
            } else if (flavorVotes.length < 2) {
                setFlavorVotes([...flavorVotes, competitorId]);
            } else {
                alert("You can only select 2 Flavor votes!");
            }
        } else if (voteType === "looks") {
            if (looksVotes.includes(competitorId)) {
                setLooksVotes(looksVotes.filter((id) => id !== competitorId));
            } else if (looksVotes.length < 2) {
                setLooksVotes([...looksVotes, competitorId]);
            } else {
                alert("You can only select 2 Looks votes!");
            }
        }
    };

    // Handle submitting votes
    const handleSubmitVotes = async () => {
        if (flavorVotes.length !== 2 || looksVotes.length !== 2) {
            alert("You must select exactly 2 Flavor votes and 2 Looks votes before submitting!");
            return;
        }

        try {
            const updates = [];

            for (const competitorId of flavorVotes) {
                const competitorRef = doc(db, "competitors", competitorId);
                updates.push(
                    updateDoc(competitorRef, {
                        flavorVotes: competitors.find((c) => c.id === competitorId).flavorVotes + 1,
                    })
                );
            }

            for (const competitorId of looksVotes) {
                const competitorRef = doc(db, "competitors", competitorId);
                updates.push(
                    updateDoc(competitorRef, {
                        looksVotes: competitors.find((c) => c.id === competitorId).looksVotes + 1,
                    })
                );
            }

            await Promise.all(updates);
            alert("Votes submitted successfully!");

            // Set localStorage flag to prevent resubmission
            localStorage.setItem("hasSubmitted", "true");
            setHasSubmitted(true);

            clearVotes();
            fetchCompetitors();
        } catch (error) {
            console.error("Error submitting votes:", error);
            alert("Failed to submit votes. Please try again.");
        }
    };

    // Clear all selected votes
    const clearVotes = () => {
        setFlavorVotes([]);
        setLooksVotes([]);
    };

    // Handle removing the submission flag
    const handleRemoveFlag = () => {
        localStorage.removeItem("hasSubmitted");
        setHasSubmitted(false);
        alert("Submission flag removed. You can now vote again.");
    };

    return (
        <div style={{ padding: "20px", position: "relative" }}>
            {/* Remove Flag Button */}
            <button
                onClick={handleRemoveFlag}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                }}
            >
                Remove Flag
            </button>

            <h1>Cookie Competition 2024</h1>

            {/* Competitors List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                {competitors.map((competitor) => (
                    <div
                        key={competitor.id}
                        style={{
                            position: "relative",
                            width: "80%",
                            maxWidth: "600px",
                            textAlign: "center",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor:
                                flavorVotes.includes(competitor.id) || looksVotes.includes(competitor.id)
                                    ? "#e0ffe0"
                                    : "white",
                        }}
                    >
                        <img
                            src={competitor.imageUrl}
                            alt={competitor.name}
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        />
                        <h4 style={{ margin: "10px 0", fontSize: "18px" }}>{competitor.name}</h4>

                        {/* Buttons for Voting */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "15px",
                                marginTop: "10px",
                            }}
                        >
                            {/* Flavor Button */}
                            <button
                                onClick={() => handleVote(competitor.id, "flavor")}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                disabled={hasSubmitted}
                            >
                                <img
                                    src={
                                        flavorVotes.includes(competitor.id)
                                            ? "/images/flavor_selected.png"
                                            : "/images/flavor.png"
                                    }
                                    alt="Flavor"
                                    style={{ width: "32px", height: "32px" }}
                                />
                            </button>

                            {/* Looks Button */}
                            <button
                                onClick={() => handleVote(competitor.id, "looks")}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                disabled={hasSubmitted}
                            >
                                <img
                                    src={
                                        looksVotes.includes(competitor.id)
                                            ? "/images/looks_selected.png"
                                            : "/images/looks.png"
                                    }
                                    alt="Looks"
                                    style={{ width: "36px", height: "36px" }}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit and Clear Buttons */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                <button
                    onClick={handleSubmitVotes}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: hasSubmitted ? "not-allowed" : "pointer",
                    }}
                    disabled={hasSubmitted} // Disable button if already submitted
                >
                    Submit Votes
                </button>
                <button
                    onClick={clearVotes}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: hasSubmitted ? "not-allowed" : "pointer",
                    }}
                    disabled={hasSubmitted} // Disable button if already submitted
                >
                    Clear Votes
                </button>
            </div>

            {/* Submission Feedback */}
            {hasSubmitted && (
                <p style={{ color: "red", marginTop: "20px" }}>
                    You have already submitted your votes. Thank you!
                </p>
            )}
        </div>
    );
};

export default App;
