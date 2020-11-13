import connection from '../database/connection';
import * as Yup from 'yup';

import InvestmentView from '../views/InvestmentView';

class InvestmentController {
  static index = async (req, res) => {
    const id = req.userId;

    //validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // get investments
    const investments = await connection('investment').where('userId', id).select('*');

    const data = await Promise.all(investments.map(async (investment) => {
      const [ serie ] = await connection('serie').where('id', investment.serieId).select('title');
      return {
        id: investment.id,
        serieTitle: serie.title,
        startDate: investment.startDate,
        expirationDate: investment.expirationDate,
        private: investment.private,
        serieId: investment.serieId,
      }
    }));

    return res.status(200).json(InvestmentView.renderMany(data));
  }

  static create = async (req, res) => {
    const { expirationDate, privateBool, serieId } = req.body;
    const userId = req.userId;

    // validate
    const schema = Yup.object().shape({
      expirationDate: Yup.date().required(),
      privateBool: Yup.boolean().required(),
      userId: Yup.number().required().integer(),
      serieId: Yup.number().required().integer(),
    });
 
    if(!(await schema.isValid({ expirationDate, privateBool, userId, serieId }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // check if investment exists
    const [ investment ] = await connection('investment').where({
      userId,
      serieId,
    }).select('private');

    if(investment !== undefined) {
      return res.status(400).json({ error: 'Investment already exists' });
    }

    // check if serie exists
    const [ serie ] = await connection('serie').where('id', serieId).select('title');

    if(serie === undefined) {
      return res.status(400).json({ error: 'Serie not found'});
    }

    //create investment
    const newInvestment = {
      startDate: new Date(),
      expirationDate: new Date(expirationDate),
      private: privateBool,
      userId,
      serieId,
    }

    const [ id ] = await connection('investment').insert(newInvestment);

    const data = {
      id,
      serieTitle: serie.title,
      startDate: newInvestment.startDate,
      expirationDate: newInvestment.expirationDate,
      private: newInvestment.private,
      serieId,
    }

    return res.status(201).json(InvestmentView.render(data));
  }

  static destroy = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
      userId: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id, userId }))) {
      return res.status(204).json();
    }

    await connection('investment').where({
      id,
      userId,
    }).del();

    return res.status(202).json({ success: true });
  }
}

export default InvestmentController;