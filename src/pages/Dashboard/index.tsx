import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInterface {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export function Dashboard(){
  const [foods, setFoods] = useState<FoodInterface[]>([])
  const [editingFood, setEditingFood] = useState<FoodInterface>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  async function componentDidMount() {
    const response = await api.get('/foods');
    setFoods(response.data);
  }

  useEffect(() => {
    componentDidMount()
  }, [])
  

  async function handleAddFood(food: FoodInterface) {
    const foodsTemp = [...foods]
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      foodsTemp.push(response.data)

      setFoods(foodsTemp);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodInterface) {
    const foodsTemp = [...foods]
    const editingFoodTemp = {...editingFood}

    console.log(food)

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFoodTemp.id}`,
        { ...food },
      );

      const foodsUpdated = foodsTemp.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    const foodsTemp = foods;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foodsTemp.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodInterface) {
    toggleEditModal()
    const editingFoodTemp = {
      ...food,
      editModalOpen: true
    }
    setEditingFood(editingFoodTemp);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={(editingFood: FoodInterface) => handleAddFood(editingFood)}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
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

export default Dashboard