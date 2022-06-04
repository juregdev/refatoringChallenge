import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';

export interface foodsStateProps {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

function Dashboard() {

  const [foods, setFoods] = useState<foodsStateProps[]>([])

  async function getApi() {
    const response = await api.get('/foods');
    setFoods(response.data);
  }


  useEffect(() => {

    getApi()
  }
    , [])

  async function handleAddFood(food: foodsStateProps) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: foodsStateProps) {

    try {
      await api.put(
        `/foods/${food.id}`,
        { ...food },
      );


      const newList = [...foods];
      newList.forEach(item => {
        if (item.id === food.id) {
          item = food
        }
      })

      getApi()
    }
    catch (err) {
      console.log(err);
    }


  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const [modalOpen, setModalOpen] = useState(false)
  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  const [editModalOpen, setEditModalOpen] = useState(false)
  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  const [editingFood, setEditingFood] = useState<foodsStateProps>({} as foodsStateProps)
  function handleEditFood(food: foodsStateProps) {
    setEditingFood(food)
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
}
;


export default Dashboard;
