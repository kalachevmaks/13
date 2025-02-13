import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [family, setFamily] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/family');
        setFamily(res.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    })();
  }, []);

  console.log(family);

  return (
    <>
    <div className="page-heading">
        <img className="page-logo" src="./Лого.png" alt="" />
        <h1>Партнеры</h1>
      </div>
      <ul className="partners-list">
        {family.map((familyMember) => {
          const years = 2025 - familyMember.date.split('-')[0];
          return <li className="partner-card" key={familyMember.id}>
            <div className="partner-data">
              <p className="card_heading">{familyMember.fio}</p>
              <div className="partner-data-info">
                <p>Количество лет: {years}</p>
                <p>Текущая должность: {familyMember.position}</p>
                <p>Место работы: {familyMember.organisation}</p>
                <p>Суммарный оклад: {familyMember.salary}</p>
              </div>
            </div>
          </li>
        })}
      </ul>
    </>
  );
}

export default App;