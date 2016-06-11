import { observable } from 'mobx';

class UiState {
  @observable showsLoading = false;
  @observable settingsLoading = false;
}

export default new UiState()
