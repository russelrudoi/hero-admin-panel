import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { filtersActiveChanged, fetchFilters, selectAll } from '../heroesFilters/filtersSlice'
import classNames from 'classnames';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
    const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters)
    const dispatch = useDispatch()
    const filters = useSelector(selectAll)

    useEffect(() => {
        dispatch(fetchFilters())
        // eslint-disable-next-line
    }, [])

    if (filtersLoadingStatus === "loading") {
        return <Spinner />;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = arr => {
        if (arr.length === 0) {
            return <h5 className='text-center mt-5'>Error</h5>
        }

        return arr.map(({ element, label, style }, i) => {
            const btnClass = classNames('btn', style, {
                'active': element === activeFilter
            })

            return <button
                key={i}
                className={`${btnClass}`}
                id={element}
                onClick={() => dispatch(filtersActiveChanged(element))}
            >{label}</button>
        })
    }

    const elements = renderFilters(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;