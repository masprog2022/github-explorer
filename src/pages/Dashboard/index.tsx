import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { FiChevronRight } from 'react-icons/fi'
import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';
//import Repository from '../Repository';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {

  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('')

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storedRepositories = localStorage.getItem(
      '@GithubExplorer:respositories',
    );
    if (storedRepositories) {
      return JSON.parse(storedRepositories);
    }
    return [];
  });




  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:respositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepositories(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (!newRepo) {
      setInputError('Digite autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`)

      //console.log(response.data)
      // add new repositories
      // consumir API do github
      // save new repositories no status

      const repository = response.data
      setRepositories([...repositories, repository])
      setNewRepo('')
      setInputError('')
    } catch (error) {
      setInputError('Erro na busca por esse repositório!');
    }


  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore Repositórios no Github</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleAddRepositories}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name}  to={`/repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url}

              alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard;


