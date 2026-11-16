'use client';

import { MoreHorizontal, Plus, Shield, Users } from 'lucide-react';
import { Avatar, Badge, EmptyState, SectionTitle } from '@/features/shared';
import type { Member, Organizer } from '@/types';

type OrganizersPageProps = {
  organizers: Organizer[];
  members: Member[];
  onNew: () => void;
  onNotice: (message: string) => void;
};

export function OrganizersPage({ organizers, members, onNew, onNotice }: OrganizersPageProps) {
  const assignedMemberIds = new Set(organizers.map((organizer) => organizer.memberId));
  const availableMembers = members.filter((member) => !assignedMemberIds.has(member.id));

  return (
    <>
      <SectionTitle
        eyebrow="EQUIPE"
        title="Organizadores"
        subtitle="Conceda acesso a membros já cadastrados na comunidade."
        action={
          <button className="button button-primary" onClick={onNew} disabled={!availableMembers.length}>
            <Plus size={16} /> Adicionar organizador
          </button>
        }
      />

      <section className="card data-card">
        <div className="table-toolbar">
          <div className="table-toolbar-heading">
            <h3>Equipe de organizadores</h3>
            <span>{organizers.length} pessoas</span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ORGANIZADOR</th>
                <th>PERMISSÃO</th>
                <th>EMAIL</th>
                <th>TELEFONE</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {organizers.map((organizer) => (
                <tr key={organizer.id}>
                  <td>
                    <div className="person-cell">
                      <Avatar name={organizer.name} />
                      <strong>{organizer.name}</strong>
                    </div>
                  </td>
                  <td>
                    <Badge tone={organizer.permission === 'Administrador' ? 'purple' : 'neutral'}>
                      {organizer.permission}
                    </Badge>
                  </td>
                  <td>{organizer.email}</td>
                  <td>{organizer.phone}</td>
                  <td>
                    <Badge dot tone={organizer.status === 'Ativo' ? 'green' : 'orange'}>
                      {organizer.status}
                    </Badge>
                  </td>
                  <td>
                    <button
                      className="table-menu"
                      aria-label={`Gerenciar permissões de ${organizer.name}`}
                      onClick={() => onNotice(`Permissão atual de ${organizer.name}: ${organizer.permission}`)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!organizers.length && (
            <EmptyState
              title="Nenhum organizador cadastrado"
              description="Adicione um membro para conceder acesso operacional ao sistema."
              icon={Shield}
            />
          )}
        </div>
        {!availableMembers.length && (
          <div className="event-note">
            <span className="note-icon"><Users size={16} /></span>
            <span>Todos os membros cadastrados já possuem acesso como organizador ou administrador.</span>
          </div>
        )}
      </section>
    </>
  );
}
