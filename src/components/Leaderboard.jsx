import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

export default function Leaderboard() {
  const [scoreList, setScoreList] = useState([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/leaderboard");
      setScoreList(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const updateScoreList = useCallback((newScore) => {
    setScoreList((prev) => {
      const newScoreList = [...prev, newScore];
      newScoreList.sort((a, b) => b.score - a.score);
      if (newScoreList.length > 100) {
        newScoreList.pop();
      }
      return newScoreList;
    });
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const socket = io();
    socket.on("score-added", (newScore) => updateScoreList(newScore));
    return () => {
      socket.disconnect();
    };
  }, [updateScoreList]);

  return (
    <div className="max-w-md min-w-min mx-auto flex flex-col h-screen py-4">
      <h1 className="mb-4 text-2xl text-center">Leaderboard</h1>
      <ul className="divide-y divide-gray-200 overflow-auto flex-grow px-4">
        {scoreList.map(({ name, score }, index) => (
          <li className="pt-3 pb-0" key={index}>
            <div className="flex items-center space-x-6 text-sm font-medium text-gray-900 whitespace-nowrap">
              <div className="w-8">
                <p>{index + 1}</p>
              </div>
              <div className="flex-1">
                <p>{name}</p>
              </div>
              <div>
                <p>{score}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
