

interface Pet {
    pet_name:string;
    name: string; // Nombre de la mascota
    health: number; // Representa el estado de vida de la mascota (inicia en 5)
    mood: number; // Estado de ánimo de la mascota
    hunger: number; // Nivel de hambre de la mascota
    physical: number; // Estado físico de la mascota (no tiene mayor uso en la prueba)
  }
  
  
function App ({
    pet
}: {
    pet:Pet
}) {


     return (
        <div id="stats">
            <h1>Nombre: {pet?.pet_name} </h1>
            <h1 className={pet?.health < 3 ? 'text-red-400' : 'text-green-400'}>Salud: {pet?.health} </h1>
            <h1>Ánimo:  {pet?.mood}</h1>
            <h1 className={pet?.hunger < 30 ? 'text-red-400' : 'text-green-400'}>Hambre: {pet?.hunger}</h1>
            <h1>Energía: {pet?.physical}</h1>
          </div>
     )
}


export default App