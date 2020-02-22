import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import Card from "../../shared/component/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/Util/validators";
import { useFrom } from "../../shared/hooks/form-hook";
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
const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [state, inputHandler, setFormData] = useFrom(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const identifiedPlace = DUMMY_PLACES.find(place => place.id === placeId);
  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          description: {
            value: identifiedPlace.description,
            isValid: true
          }
        },
        true
      );
    }

    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(state.inputs);
  };
  if (isLoading)
    return (
      <div className='center'>
        <h1>Loading...</h1>
      </div>
    );
  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
        onInput={inputHandler}
        initailValue={state.inputs.title.value}
        initailValid={state.inputs.title.isValid}
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description (min. 5 characters).'
        onInput={inputHandler}
        initailValue={state.inputs.description.value}
        initailValid={state.inputs.description.isValid}
      />
      <Button type='submit' disabled={!state.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
