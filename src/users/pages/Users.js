import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const Users = [
    {
      id: "u1",
      name: "Ali Kadhim",
      image: "https://unsplash.it/id/1/200",
      palces: 1
    },
    {
      id: "u2",
      name: "Zainenb Al-Ibrahim",
      image: "https://unsplash.it/id/20/200",
      palces: 5
    },
    {
      id: "u3",
      name: "Hussien Kadhim",
      image: "https://unsplash.it/id/22/200",
      palces: 12
    },
    {
      id: "u4",
      name: "Rokaya Kadhim",
      image: "https://unsplash.it/id/25/200",
      palces: 16
    },
    {
      id: "u5",
      name: "Mohammed Kadhim",
      image: "https://unsplash.it/id/26/200",
      palces: 6
    }
  ];
  return <UsersList items={Users} />;
};

export default Users;
