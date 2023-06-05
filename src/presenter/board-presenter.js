import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import PointView from '../view/point-view';
import EditFormView from '../view/edit-form-view';
import CreationFormView from '../view/creation-form-view';
import NoPointsView from '../view/no-points-view';
import {render, replace} from '../framework/render.js';
import { isEscapeKey } from '../utils';

export default class BoardPresenter {
  #boardContainer = null;
  #tripPointsModel = null;
  #eventListComponent = null;

  constructor({boardContainer, tripPointsModel}) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
  }

  init() {
    const tripPoints = [...this.#tripPointsModel.tripPoints];
    if (tripPoints.length === 0) {
      render(new NoPointsView(), this.#boardContainer);
    } else {
      this.#eventListComponent = new PointsListView();
      render(new SortView(), this.#boardContainer);
      render(this.#eventListComponent, this.#boardContainer);

      render(new CreationFormView(tripPoints[0]), this.#eventListComponent.element);

      for (let i = 1; i < tripPoints.length - 1; i++) {
        this.#renderTripPoint(tripPoints[i]);
      }
    }
  }

  #renderTripPoint(tripPoint) {
    const ecsKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.body.removeEventListener('keydown', ecsKeyDownHandler);
      }
    };

    const tripPointComponent = new PointView({
      tripPoint,
      onEditClick: () => {
        replacePointToForm.call(this);
        document.body.addEventListener('keydown', ecsKeyDownHandler);
      }
    });

    const editFormComponent = new EditFormView({
      tripPoint,
      onFormSubmit: () => {
        replaceFormToPoint.call(this);
        document.body.removeEventListener('keydown', ecsKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(editFormComponent, tripPointComponent);
    }

    function replaceFormToPoint() {
      replace(tripPointComponent, editFormComponent);
    }

    render(tripPointComponent, this.#eventListComponent.element);
  }
}
