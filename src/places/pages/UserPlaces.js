import React, { Fragment } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "My address",
    imageUrl: "https://www.jaapedendreef.nl/wp-content/uploads/14539990.jpg",
    address: "Jaap Edendreef 3562 AT Utrech",
    location: {
      lat: 52.1179193,
      lng: 5.126573
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://aws-tiqets-cdn.imgix.net/images/content/cca6a94da73f40bf8e83012b21fd4226.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=25&s=e4570998813b2c0a5dfec3b178cd3d45&w=400&h=320&dpr=2.625",
    address: "20 W 34th St, New York, NY 10001، الولايات المتحدة",
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: "u2"
  }
];
const UserPlaces = () => {
  const userId = useParams().userId;

  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return (
    <Fragment>
      <PlaceList items={loadedPlaces} />
    </Fragment>
  );
};

export default UserPlaces;
