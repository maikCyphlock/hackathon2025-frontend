import { Button } from '@/components/ui/button'
import './App.css'
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import useNetworkStatus from './hooks/useNetworkStatus'
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import PetsStats from './components/PetsStats';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu'

const API_URL = 'https://cors-anywhere.herokuapp.com/https://hackaton.corpoeureka.net'
const FEED_URL = '/pet/feed'
const PLAY_URL = '/pet/play'
const CREATE_URL = '/pet/create'
const TRAIN_URL = '/pet/train'
const PET_URL = '/pet/pet'
const SCOLD_URL = '/pet/scold'
const REST_URL = '/pet/rest'

interface Pet {
  pet_name: string;
  result: any
  name: string; // Nombre de la mascota
  health: number; // Representa el estado de vida de la mascota (inicia en 5)
  mood: number; // Estado de ánimo de la mascota
  hunger: number; // Nivel de hambre de la mascota
  physical: number; // Estado físico de la mascota (no tiene mayor uso en la prueba)
}



function App() {


  const isOnline = useNetworkStatus()

  const [isDead, setIsDead] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [restingTime, setRestingTime] = useState(0);
  const [pet, setPet] = useState<Pet | null>();
  const [isConnected, setIsConnected] = useState(true)


  const handleClick = () => {
    
  };

  const handlerConnection = async () => {
    try {
      await axios.get<Pet>(`${API_URL}${CREATE_URL}`);
      if (pet) {
        setIsConnected(true)
      }
    } catch (error: any) {
      if (error?.code === "ERR_NETWORK") {
        setIsConnected(false)
      }
    }

  }
  // Verificar si hay conexión a internet
  useEffect(() => {
    console.log(isConnected)
  }, [isConnected])

  useEffect(() => {
    handlerConnection()
  }, [])

  // Verificar si la mascota está muerta
  useEffect(() => {
    if (pet) {
      setIsDead(false);
      if (pet.health <= 0) {
        setIsDead(true);
        toast.error('tu mascota ha muerto')
      }
    }
    else {
      setIsDead(true)
    }
  }, [pet, restingTime])


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

  const { mutate: handlerScoldMutation } = useMutation({
    mutationFn: async () => {
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
      return scoldData
    },
    onSuccess: (scoldData) => {
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
    },
    onError: (error) =>{
      console.error('Error scolding pet:', error);
      toast.error('Error al regañar la mascota');
    }

  })

  
  const { mutate: handlerPettingMutation } = useMutation({
    mutationFn: async () => {
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
      return pettingData;
    },
    onSuccess: (pettingData) => {
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
    },
    onError: (error) => {
      console.error('Error petting pet:', error);
      toast.error('Error al acariciar la mascota');
    }
  });
 
  const { mutate: handlerPlayMutation } = useMutation({
    mutationFn: async (playWith: 'ball' | 'hide' | 'draw') => {
      const { data: playData } = await axios.post<Pet>(
        `${API_URL}${PLAY_URL}`, {
        name: pet?.pet_name,
        mood: pet?.mood,
        play_with: playWith,
        hunger: pet?.hunger
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return playData;
    },
    onSuccess: (playData) => {
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
        toast.success(playData.result.msj);
      }
    },
    onError: (error) => {
      console.error('Error playing pet:', error);
      toast.error('Error al jugar con la mascota');
    }
  });
  const { mutate: handlerTrainMutation } = useMutation({
    mutationFn: async () => {
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
      return TrainData;
    },
    onSuccess: (TrainData) => {
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
    },
    onError: (error) => {
      console.error('Error training pet:', error);
      toast.error('Error al entrenar la mascota');
    }
  });

  const { mutate: handlerRestMutation } = useMutation({
    mutationFn: async () => {
      const { data: RestData } = await axios.get(`${API_URL}${REST_URL}`);
      return RestData;
    },
    onSuccess: (RestData) => {
      if (pet) {
        setIsResting(true);
        setRestingTime(RestData.rest_time * 60);
        setPet({
          ...pet,
          mood: Math.min(pet.mood + RestData.mood_mod, 100),
        });
      }
    },
    onError: (error) => {
      console.error('Error resting pet:', error);
      toast.error('Error al descansar la mascota');
    }
  });

  const handlerRest = () => {
    if (!pet) return;
    if (isDead) return toast.error('La mascota está muerta');
    handlerRestMutation();
  }

  useEffect(() => {
    if (isResting && restingTime > 0) {
      const interval = setInterval(() => {
        setRestingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsResting(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Decrease every second

      return () => clearInterval(interval);
    }
  }, [isResting, restingTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pet && pet.health <= 0) {
        setIsDead(true);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [pet]);

  const { mutate: handlerFeedMutation } = useMutation({
    mutationFn: async (foodValue: 'bg' | 'md' | 'sm') => {
      const { data: feedData } = await axios.post<Pet>(
        `${API_URL}${FEED_URL}`, {
        name: pet?.pet_name,
        food_value: foodValue,
        mood: pet?.mood
      },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return feedData;
    },
    onSuccess: (feedData) => {
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
    },
    onError: (error) => {
      console.error('Error feeding pet:', error);
      toast.error('Error al alimentar la mascota');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPetMutation();
  };




  useEffect(() => {
    if (!isConnected) return; // Check for internet connection

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
  }, [isConnected]); // Add isConnected as a dependency

  const setthisFalse = (e) => {
    e.preventDefault()
    setIsConnected(() => !isConnected)
  }


  return (
    <>
    <Fireworks autorun={{ duration: 3, speed: 1 }}  />
      {
        <Dialog open={!isConnected}>

          <DialogContent>
            <DialogTitle>Sin Conexión</DialogTitle>
            <DialogDescription>Reconectando...</DialogDescription>
            <button onClick={setthisFalse} type='submit'>cerrar

            </button>
          </DialogContent>
        </Dialog>
      }
      <main className='flex flex-col gap-8 items-center justify-center'>
        <section className='flex flex-col md:flex-row  items-center justify-center gap-4'>
            {
            pet && pet.health > 0 ? (
              isResting ? (
              <img className='object-fit w-64 rounded-2xl' src="sleeping.gif" alt="Sleeping Cat" />
              ) : (
              <img className='object-fit w-64 rounded-2xl' src="gato.gif" alt="Cat" />
              )
            ) : (
              <img className='object-fit w-64 rounded-2xl' src="dead.gif" alt="Dead Cat" />
            )
            }
          <section className='flex flex-col gap-4'>
            {
              !isOnline ? (
                <>
                  <div>
                    <h1>no tienes conexión a internet</h1>
                  </div>
                </>
              ) : null
            }
            <PetsStats pet={pet} />
          </section>
        </section>
        {
          isResting ? (
            <>
              <Progress className='w-full' value={restingTime} />
              <p>Tiempo restante de descanso: {restingTime.toFixed(2)} segundos</p>
              <Button onClick={() => {
                setRestingTime(0)
                setIsResting(false)
              }}>Detener Descanso</Button>
            </>
          ) : null
        }

        {

          !isResting ? (
            <>
              <section className='grid md:grid-cols-3 gap-4'>

                <Button className='col-span-3' onClick={handleSubmit}>Crear</Button>
                {
                  !isDead ? (
                    <>
                     <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                     <Button >Alimentar</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handlerFeedMutation('bg')}>Carne asada</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlerFeedMutation('sm')}>lechugas</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlerFeedMutation('md')}>arepas</DropdownMenuItem>
                      
                        </DropdownMenuContent> 
                     </DropdownMenu>
                   
                      <Button onClick={() => handlerPettingMutation()}>Acariciar</Button>
                      <Button onClick={() => handlerScoldMutation() }>Regañar</Button>
                      <Dialog>
                        <DialogTrigger>
                          <Button>Descansar</Button>
                        </DialogTrigger>

                        <DialogContent>

                          <DialogDescription>¿Deseas enviar a descansar a tu mascota?</DialogDescription>
                          <Button onClick={() => handlerRestMutation()}>Sí</Button>

                        </DialogContent>
                      </Dialog>
                      {
                        isOnline ? (<>
                         <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                     <Button disabled={!isConnected} >Jugar</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handlerPlayMutation('ball')}>jugar con pelota</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlerPlayMutation('draw')}>dibujo</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlerPlayMutation('hide')}>escondidas</DropdownMenuItem>
                      
                        </DropdownMenuContent> 
                     </DropdownMenu>
          
                          <Button disabled={!isConnected} onClick={() => handlerTrainMutation()}>Entrenar</Button>
                        </>) : null
                      }

                    </>) : null
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
