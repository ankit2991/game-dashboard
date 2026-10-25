import type { OperatorGameActivation, OperatorIntegrationGame } from '../api/operator';

export const operatorGameStateLabel: Record<OperatorGameActivation, string> = {
  not_selected: 'Not requested',
  provisioning_pending: 'Awaiting partner provisioning',
  approval_pending: 'Awaiting admin game approval',
  access_suspended: 'Partner API suspended',
  backend_setup_required: 'Authorized · backend setup required',
  authorized_config_only: 'Authorized · configuration only',
  removal_pending: 'Removal pending admin sync',
};

export function gameActivationLabel(game: OperatorIntegrationGame | undefined): string {
  return game ? operatorGameStateLabel[game.state] : 'Activation status unavailable';
}

export function activationNeedsAttention(game: OperatorIntegrationGame | undefined): boolean {
  return Boolean(game && game.state !== 'authorized_config_only' && game.state !== 'not_selected');
}
