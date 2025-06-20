
import { useEffect } from 'react';
import { Awareness } from 'y-protocols/awareness';

export function CursorsStyles({ awareness }: { awareness: Awareness }) {
  useEffect(() => {
    const update = () => {
      let styles = '';
      awareness.getStates().forEach((state, clientId) => {
        const color = state.user?.color || '#000';
        const name = state.user?.name || `User ${clientId}`;
        styles += `
          .yRemoteSelection-${clientId}, .yRemoteSelectionHead-${clientId} {
            --user-color: ${color};
          }
          .yRemoteSelectionHead-${clientId}::after {
            content: "${name}";
          }
        `;
      });
      let tag = document.getElementById('y-cursors-styles');
      if (!tag) {
        tag = document.createElement('style');
        tag.id = 'y-cursors-styles';
        document.head.appendChild(tag);
      }
      tag.textContent = styles;
    };
    awareness.on('change', update);
    update();
    return () => awareness.off('change', update);
  }, [awareness]);

  return null;
}
