"use client"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"

import { Progress } from "@/components/ui/progress"

import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { DialogTrigger } from '@radix-ui/react-dialog';

const API_URL = 'https://cors-anywhere.herokuapp.com/https://hackaton.corpoeureka.net'
const FEED_URL = '/pet/feed'
const PLAY_URL = '/pet/play'
const CREATE_URL = '/pet/create'
const TRAIN_URL = '/pet/train'
const PET_URL = '/pet/pet'
const SCOLD_URL = '/pet/scold'
const REST_URL = '/pet/rest'

interface Pet {
  name: string; // Nombre de la mascota
  health: number; // Representa el estado de vida de la mascota (inicia en 5)
  mood: number; // Estado de ánimo de la mascota
  hunger: number; // Nivel de hambre de la mascota
  physical: number; // Estado físico de la mascota (no tiene mayor uso en la prueba)
}



function App() {



  const [isDead, setIsDead] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [restingTime, setRestingTime] = useState(0);
  const [pet, setPet] = useState<Pet | null>();
  const [isConnected, setIsConnected] = useState(true)
  const [petName, setPetName] = useState(''); // Nuevo estado para el nombre

  const handlerConnection = async () => {
    try {
      const { data: IsConnected } = await axios.get<Pet>(`${API_URL}${CREATE_URL}`);
      if (pet) {
        setIsConnected(true)
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setIsConnected(false)
      }
    }

  }

  useEffect(() => {
    console.log(isConnected)
  }, [isConnected])

  useEffect(() => {
    handlerConnection()
  }, [])

  useEffect(() => {
    if (pet) {
      if (pet.health <= 0) {
        setIsDead(false);
      }

    }
    else {
      setIsDead(false)
    }
  }, [pet])


  const { mutate: createPetMutation } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get<Pet>(
        `${API_URL}${CREATE_URL}`,
      );
      return data;
    },
    onSuccess: (data) => {
      setPet(data);
      toast.success('Mascota creada con éxito');
    },
    onError: (error) => {
      console.error('Error creating pet:', error);
      toast.error('Error al crear la mascota');
    }
  });

  const handlerScold = async () => {
    try {
      const { data: scoldData } = await axios.post<Pet>(
        `${API_URL}${SCOLD_URL}`, {
        name: pet?.pet_name,
        mood: pet?.mood
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (pet) {
        if (scoldData.result.mood_mod === 0) {
          toast.error('No se puede regañar la mascota');
        }
        setPet({
          ...pet,
          mood: pet.mood + scoldData?.result?.mood_mod
        });
        toast.success(scoldData.result.msj);
      }
    } catch (error) {
      console.error('Error scolding pet:', error);
      toast.error('Error al regañar la mascota');
    }

  }

  const handlerPetting = async () => {
    try {
      const { data: pettingData } = await axios.post<Pet>(
        `${API_URL}${PET_URL}`, {
        name: pet?.pet_name,
        mood: pet?.mood
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (pet) {
        if (pettingData.result.mood_mod === 0) {
          toast.error('No se puede acariciar la mascota');
        }
        if (pet.mood > 99) {
          return toast.error('La mascota no quiere ser acariciada');
        }
        setPet({
          ...pet,
          mood: pet.mood + pettingData?.result?.mood_mod
        });
        toast.success(pettingData.result.msj);
      }
    }
    catch (error) {
      console.error('Error petting pet:', error);
      toast.error('Error al acariciar la mascota');
    }
  }

  const handlerPay = async () => {
    try {
      const { data: playData } = await axios.post<Pet>(
        `${API_URL}${PLAY_URL}`, {
        name: pet?.pet_name,
        mood: pet?.mood,
        play_with: 'ball',
        hunger: pet?.hunger
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (pet) {
        if (playData.result.result == 'failure') {
          return toast.error('No se puede jugar con la mascota');
        }
        if (playData.result.mood_mod === 0) {
          toast.error('No se puede jugar con la mascota');
        }
        if (pet.mood > 99) {
          return toast.error('La mascota no quiere jugar');
        }
        setPet({
          ...pet,
          mood: Math.min(pet.mood + playData?.result?.mood_mod, 100),
          hunger: Math.max(pet.hunger + playData?.result?.hunger_mod, 0),
          physical: Math.max(pet.physical + playData?.result?.physical_mod, 100)

        });
        toast.success(playData.result.msj)
      }
    }
    catch (error) {
      console.error('Error playing pet:', error);
      toast.error('Error al jugar con la mascota');
    }
  }
  const handlerTrain = async () => {
    try {
      const { data: TrainData } = await axios.post<Pet>(
        `${API_URL}${TRAIN_URL}`, {
        name: pet?.pet_name,
        train_tier: 'lw',
        mood: pet?.mood,
        hunger: pet?.hunger
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );


      if (pet) {
        if (TrainData.result.result === 'failure') {
          return toast.error(TrainData.result.msj);
        }
        if (TrainData.result.mood_mod === 0) {
          toast.error('No se puede entrenar la mascota');
        }
        if (pet.mood > 99) {
          return toast.error('La mascota no quiere entrenar');
        }
        setPet({
          ...pet,
          mood: Math.min(pet.mood + TrainData?.result?.mood_mod, 100),
          hunger: Math.min(pet.hunger + TrainData?.result?.hunger_mod, 100),
          physical: Math.min(pet.physical + TrainData?.result?.physical_mod, 100)
        });
        toast.success(TrainData?.result.msj);
      }
    }
    catch (error) {
      console.error('Error training pet:', error);
      toast.error('Error al entrenar la mascota');
    }

  }
  const handlerRest = async () => {
    try {
      const { data: restData } = await axios.get<Pet>(
        `${API_URL}${REST_URL}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (pet) {
        if (restData.result.mood_mod === 0) {
          toast.error('No se puede descansar la mascota');
        }
        if (pet.mood > 99) {
          return toast.error('La mascota no quiere descansar');
        }
        setIsResting(true);
        setPet({
          ...pet,
          mood: Math.min(pet.mood + restData?.result?.mood_mod, 100),
          hunger: Math.min(pet.hunger + restData?.result?.hunger_mod, 100),
          physical: Math.min(pet.physical + restData?.result?.physical_mod, 100)
        });
        setRestingTime(restData?.result?.rest_time)
        toast.success(restData.result.msj);
      }
    }
    catch (error) {
      console.error('Error resting pet:', error);
      toast.error('Error al descansar la mascota');
    }
  }

  const handlerFeed = async () => {
    try {
      const { data: feedData } = await axios.post<Pet>(
        `${API_URL}${FEED_URL}`, {
        name: pet?.pet_name,
        food_value: 'md',
        mood: pet?.mood
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (pet) {
        console.log(feedData.result)
        if (pet.hunger > 99) {
          return toast.error('La mascota no tiene hambre');
        }
        if (feedData.result.hunger_mod === 0) {
          toast.error('No se puede alimentar la mascota');
        }
        setPet({
          ...pet,
          hunger: Math.min(pet.hunger + feedData?.result?.hunger_mod, 100),
          mood: Math.min(pet.mood + feedData?.result?.mood_mod, 100),
        });
        toast.success(feedData.result.msj);
      }
    } catch (error) {
      console.error('Error feeding pet:', error);
      toast.error('Error al alimentar la mascota');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPetMutation();
  };

  useEffect(() => {
    const RestingInterval = setInterval(() => {

    },)
    return () => clearInterval(RestingInterval);
  }, [])

  useEffect(() => {
    const hungerInterval = setInterval(() => {
      setPet((prevPet) => {
        if (!prevPet) return prevPet;

        const randomHungerLoss = Math.floor(Math.random() * 21) + 5; // Reduce entre 5 y 25
        const newHunger = Math.max(prevPet.hunger - randomHungerLoss, 0);

        // Si el hambre llega a 0, la mascota pierde 1 de vida cada minuto
        if (newHunger === 0) {
          return {
            ...prevPet,
            hunger: newHunger,
            health: Math.max(prevPet.health - 1, 0),
          };
        }

        return {
          ...prevPet,
          hunger: newHunger,
        };
      });
    }, 6000); // 1 minuto

    return () => clearInterval(hungerInterval);
  }, []);




  return (
    <>
      {
        <Dialog open={!isConnected}>
          <DialogContent>

            <DialogDescription>NO TIENES CONEXIÓN A INTERNET</DialogDescription>
            <button type='submit'>cerrar
              
            </button>
          </DialogContent>
        </Dialog>
      }
      <main className='flex flex-col gap-8 items-center justify-center min-h-screen bg-gray-100'>
        <section className='flex  items-center justify-center gap-4'>
          {
            pet?.health > 0 ? (
              <img className='object-fit w-64' src="gato.gif" alt="" />
            ) : (
              <img className='object-fit w-64' src="dead.gif" alt="" />
            )
          }

          <div id="stats">
            <h1>Nombre: {pet?.pet_name} </h1>
            <h1 className={pet?.health < 3 ? 'text-red-400' : 'text-green-400'}>Salud: {pet?.health} </h1>
            <h1>Ánimo:  {pet?.mood}</h1>
            <h1 className={pet?.hunger < 30 ? 'text-red-400' : 'text-green-400'}>Hambre: {pet?.hunger}</h1>
            <h1>Energía: {pet?.physical}</h1>
          </div>
        </section>{
          !isResting ? (
            <>
              <section className='grid md:grid-cols-3 gap-4'>

                <Button onClick={handleSubmit}>Crear</Button>
                {
                  isDead ? (
                    <><Button onClick={handlerFeed}>Alimentar</Button>
                      <Button onClick={handlerPetting}>Acariciar</Button>
                      <Button onClick={handlerScold}>Regañar</Button>
                      <Dialog>
                        <DialogTrigger>
                          <Button>Descansar</Button>
                        </DialogTrigger>

                        <DialogContent>

                          <DialogDescription>¿Deseas enviar a descansar a tu mascota?</DialogDescription>
                          <Button onClick={handlerRest}>Sí</Button>
                          <Progress value={50}></Progress>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={handlerPay}>Jugar</Button>
                      <Button onClick={handlerTrain}>Entrenar</Button></>) : null
                }
              </section>



            </>
          ) : null
        }

      </main>
    </>
  )
}

export default App
