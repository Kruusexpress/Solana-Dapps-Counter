use anchor_lang::prelude::*;

declare_id!("CounterProgram11111111111111111111111111111");

#[program]
pub mod solana_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.owner = ctx.accounts.user.key();
        counter.name = String::new();
        msg!("Counter initialized by {}", ctx.accounts.user.key());
        Ok(())
    }

    pub fn initialize_with_name(ctx: Context<Initialize>, name: String) -> Result<()> {
        require!(name.len() <= 32, CounterError::NameTooLong);
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.owner = ctx.accounts.user.key();
        counter.name = name.clone();
        msg!("Counter '{}' initialized by {}", name, ctx.accounts.user.key());
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).ok_or(CounterError::Overflow)?;
        msg!("Counter incremented to {}", counter.count);
        Ok(())
    }

    pub fn increment_by(ctx: Context<Update>, amount: u64) -> Result<()> {
        require!(amount > 0, CounterError::InvalidAmount);
        let counter = &mut ctx.accounts.counter;
        counter.count = counter
            .count
            .checked_add(amount)
            .ok_or(CounterError::Overflow)?;
        msg!("Counter incremented by {} to {}", amount, counter.count);
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter
            .count
            .checked_sub(1)
            .ok_or(CounterError::Underflow)?;
        msg!("Counter decremented to {}", counter.count);
        Ok(())
    }

    pub fn decrement_by(ctx: Context<Update>, amount: u64) -> Result<()> {
        require!(amount > 0, CounterError::InvalidAmount);
        let counter = &mut ctx.accounts.counter;
        counter.count = counter
            .count
            .checked_sub(amount)
            .ok_or(CounterError::Underflow)?;
        msg!("Counter decremented by {} to {}", amount, counter.count);
        Ok(())
    }

    pub fn reset(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter reset to 0");
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = value;
        msg!("Counter set to {}", value);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32 + 32)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = owner)]
    pub counter: Account<'info, Counter>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub owner: Pubkey,
    pub name: String,
}

#[error_code]
pub enum CounterError {
    #[msg("Counter overflow")] Overflow,
    #[msg("Counter underflow")] Underflow,
    #[msg("Invalid amount")] InvalidAmount,
    #[msg("Name is too long")] NameTooLong,
}