import { useHttp } from '../../hooks/http.hook';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { heroCreated } from '../heroesList/heroesSlice';
import { v4 as uiidv4 } from 'uuid';
import { selectAll } from '../heroesFilters/filtersSlice';

const HeroesAddForm = () => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [element, setElement] = useState('');

    const { filtersLoadingStatus } = useSelector(state => state.filters);
    const filters = useSelector(selectAll)
    const dispatch = useDispatch()
    const { request } = useHttp()

    const onSubmitHeroy = (e) => {
        e.preventDefault()

        const newHero = {
            id: uiidv4(),
            name,
            text,
            element
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'successfully'))
            .then(() => dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))

        setName('')
        setText('')
        setElement('')
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option className="text-center mt-5">Загрузка...</option>
        } else if (status === "error") {
            return <option className="text-center mt-5">Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map((item, i) => {
                if (item.element === 'all') return;
                    
                return <option key={i} value={item.element}>{item.label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }}
                    value={text}
                    onChange={(e) => setText(e.target.value)} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={element}
                    onChange={(e) => setElement(e.target.value)}>
                    <option>Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => onSubmitHeroy(e)}
            >Создать
            </button>
        </form>
    )
}

export default HeroesAddForm;